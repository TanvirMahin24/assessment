export abstract class BaseService {
  protected abstract repository: any;

  protected validateId(id: string): void {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid ID provided');
    }
  }
}

