class Table<T> {
  private collection: Array<T & { id: string }> = [];
  private lastId: number = 0;

  create(item: T) {
    this.collection.push({
      id: String(++this.lastId),
      ...item,
    });

    return this.collection[this.collection.length - 1]
  }

  findAll(filter?: Parameters<typeof Array.prototype.find>[0]) {
    if (filter) return this.collection.filter(filter);

    return this.collection;
  }

  edit(id: string, data: T) {
    const [item] = this.findAll((item) => item.id === id);
    if (!item) throw new Error(`Item (id: ${id}) not found`);

    Object.assign(item, data);
  }
}

export type Note = {
  id: string;
  title: string;
  content?: string;
};

export default {
  notes: new Table<Note>(),
};
