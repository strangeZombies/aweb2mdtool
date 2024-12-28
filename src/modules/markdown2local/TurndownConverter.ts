import YAML from 'yaml';
import TurndownService from 'turndown';
import { gfm } from '@joplin/turndown-plugin-gfm';
import { Readability } from '@mozilla/readability';
import urlMetadata from 'url-metadata';

// 定义自定义的 Metadata 接口
interface Metadata {
  title?: string;
  description?: string;
  author?: string;
  keywords?: string;
}

interface YamlHeader {
  category: string;
  author: string;
  title: string;
  source: string;
  clipped: string;
  published: string | null;
  description: string;
  tags: string[];
}

class TurndownConverter {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      hr: '---',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced',
      emDelimiter: '*',
    });
    this.turndownService.use(gfm);
    this.turndownService.remove('style');
  }

  private formatDate(date: Date = new Date()): string {
    return date.toISOString(); // Simplified to use ISO string format
  }

  private async fetchMetadata(url: string): Promise<Metadata | object> {
    try {
      return await urlMetadata(url);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return {};
    }
  }

  private async generateYamlHeader(baseTags: string[]): Promise<string> {
    const title = document.title || 'Untitled Document';
    const url = window.location.href;
    const metadata = await this.fetchMetadata(url);

    const { description = '', author = '匿名', keywords = '' } = metadata as Metadata;

    // Extract article tags from meta tags
    const articleTagsArray = Array.from(
      document.querySelectorAll('meta[property="article:tag"]'),
    ).map((tag) => tag.getAttribute('content') || '');

    // Extract publication date from meta tags
    const publicationDateMeta = document.querySelector('meta[property="article:published_time"]');
    const published = publicationDateMeta ? publicationDateMeta.getAttribute('content') : '';

    const combinedTags = [
      ...new Set([
        ...baseTags,
        ...articleTagsArray,
        ...keywords.split(',').map((tag) => tag.trim()),
      ]),
    ];

    const yamlObj: YamlHeader = {
      category: '[[Clippings]]',
      author,
      title,
      source: url,
      clipped: this.formatDate(),
      published, // Include the extracted publication date
      description,
      tags: combinedTags, // Add combined tags
    };

    return YAML.stringify(yamlObj, { indent: 2 });
  }

  public async convertPageToMarkdown(baseTags: string[]): Promise<{ title: string; md: string }> {
    const docClone = document.cloneNode(true) as Document;
    const article = new Readability(docClone).parse();

    if (!article) {
      throw new Error('Could not parse the article.');
    }

    const yamlHeader = await this.generateYamlHeader(baseTags);
    const markdownContent = this.turndownService.turndown(article.content);
    const title = article.title || 'Untitled Document';
    return { title, md: `---\n${yamlHeader}---\n\n${markdownContent}` };
  }

  public convertSelectionToMarkdown(): string | null {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(range.cloneContents());
      return this.turndownService.turndown(tempDiv.innerHTML);
    }
    throw new Error('No text selected.');
  }
}

// Create an instance of the converter
const turndownConverter = new TurndownConverter();

// Export the methods for global access
export const convertPageToMarkdown = async (baseTags: string[]) =>
  await turndownConverter.convertPageToMarkdown(baseTags);
export const convertSelectionToMarkdown = () => turndownConverter.convertSelectionToMarkdown();
