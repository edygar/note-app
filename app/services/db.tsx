type ErrorEntry = [string | null, string];

type NullablePartial<T> = Partial<
  {
    [P in keyof T]: T[P] | null;
  }
>;

class ValidationException extends Error {
  constructor(private errorMessages: ErrorEntry[]) {
    super("Validation failed");
    this.name = "ValidationException";
  }

  get errors() {
    return this.errorMessages;
  }
}

class Table<T> {
  private collection: Array<T & { id: string }> = [];
  private lastId: number = 0;

  constructor(private validator?: (item: T) => ErrorEntry[]) {}

  validate(item: T): item is T {
    const errors = this.validator?.(item) || [];
    if (errors.length) {
      throw new ValidationException(errors);
    }

    return true;
  }

  create(item: T) {
    this.validate(item);
    this.collection.push({
      id: String(++this.lastId),
      ...item,
    });

    return this.collection[this.collection.length - 1];
  }

  findAll(filter?: Parameters<typeof Array.prototype.find>[0]) {
    if (filter) return this.collection.filter(filter);

    return this.collection;
  }

  edit(id: string, data: NullablePartial<T>) {
    const [item] = this.findAll((item) => item.id === id);
    if (!item) throw new Error(`Item (id: ${id}) not found`);

    const nextItem = Object.assign({}, item, data);
    this.validate(nextItem);
    Object.assign(item, nextItem);
  }
}

export type Note = {
  id: string;
  title: string;
  content?: string;
};

export default {
  notes: new Table<Note>((item) => {
    const errors: ErrorEntry[] = [];
    if (!item.title?.trim()) {
      errors.push(["title", "Title is mandatory"]);
    }

    return errors;
  }),
};
