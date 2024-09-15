declare module 'wappalyzer' {
    interface WappalyzerOptions {
        debug?: boolean;
        delay?: number;
        headers?: { [key: string]: string };
        maxDepth?: number;
        maxUrls?: number;
        maxWait?: number;
        recursive?: boolean;
        probe?: boolean;
        proxy?: string;
        userAgent?: string;
    }

    interface WappalyzerTechnologyCategory {
        id: number;
        slug: string;
        name: string;
    }

    interface WappalyzerTechnology {
        slug: string;
        name: string;
        description: string | null;
        confidence: number;
        version: string | null;
        icon: string;
        website: string;
        cpe: string | null;
        categories: WappalyzerTechnologyCategory[];
        rootPath?: boolean;
    }

    interface WappalyzerUrlResult {
        status: number;
    }

    interface WappalyzerResults {
        urls: { [url: string]: WappalyzerUrlResult };
        technologies: WappalyzerTechnology[];
    }

    class Wappalyzer {
        constructor(options?: WappalyzerOptions);
        open(url: string): Promise<{ analyze: () => Promise<WappalyzerResults> }>;
        init(): Promise<void>;
        destroy(): Promise<void>;
    }

    export = Wappalyzer;
}
