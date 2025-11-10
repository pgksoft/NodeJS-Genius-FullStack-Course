import fs from 'node:fs/promises';

type StateConfig = { storagePath: string };
type FileState = { executed: string[] };

export class MigrationState {
  private readonly storagePath: string;
  private cache: Set<string> = new Set();

  constructor(cfg: StateConfig) {
    this.storagePath = cfg.storagePath;
  }

  async init(): Promise<void> {
    try {
      const raw = await fs.readFile(this.storagePath, 'utf-8');
      const data = JSON.parse(raw) as FileState;
      this.cache = new Set(data.executed);
    } catch {
      await fs.writeFile(this.storagePath, JSON.stringify({ executed: [] }, null, 2));
      this.cache = new Set();
    }
  }

  async getExecutedIds(): Promise<Set<string>> {
    return new Set(this.cache);
  }

  async markExecuted(id: string): Promise<void> {
    this.cache.add(id);
    await this.flush();
  }

  async unmarkExecuted(id: string): Promise<void> {
    this.cache.delete(id);
    await this.flush();
  }

  private async flush(): Promise<void> {
    const data: FileState = { executed: [...this.cache] };
    await fs.writeFile(this.storagePath, JSON.stringify(data, null, 2));
  }
}
