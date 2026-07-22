/**
 * In-Memory Data Store & Sync Layer for Riyad Store API
 * Ensures zero-downtime operation whether MongoDB Atlas is connected or offline.
 */

const initialCommands = require('./seedData');

class InMemoryStore {
  constructor() {
    this.items = [...initialCommands];
    this.counter = this.items.length > 0 ? Math.max(...this.items.map(i => i.id)) : 0;
  }

  getAll() {
    return [...this.items];
  }

  getById(id) {
    const numId = Number(id);
    return this.items.find(item => item.id === numId || String(item._id) === String(id));
  }

  search(query = '', category = '', author = '', sort = 'newest') {
    let result = [...this.items];
    const q = (query || '').toLowerCase().trim();

    if (q) {
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          item.rawCode.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (author) {
      result = result.filter(item => item.author.toLowerCase() === author.toLowerCase());
    }

    // Sorting logic
    if (sort === 'trending' || sort === 'popular') {
      result.sort((a, b) => b.downloads + b.likes * 2 - (a.downloads + a.likes * 2));
    } else if (sort === 'downloads') {
      result.sort((a, b) => b.downloads - a.downloads);
    } else if (sort === 'likes') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'featured') {
      result = result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    } else {
      // default: newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  add(data) {
    this.counter += 1;
    const newItem = {
      id: this.counter,
      name: data.name,
      version: data.version || '1.0.0',
      author: data.author || 'Anonymous',
      category: data.category || 'General',
      description: data.description || '',
      rawCode: data.rawCode || '',
      downloads: Number(data.downloads) || 0,
      likes: Number(data.likes) || 0,
      isFeatured: Boolean(data.isFeatured),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.items.push(newItem);
    return newItem;
  }

  update(id, data) {
    const item = this.getById(id);
    if (!item) return null;

    if (data.name !== undefined) item.name = data.name;
    if (data.version !== undefined) item.version = data.version;
    if (data.author !== undefined) item.author = data.author;
    if (data.category !== undefined) item.category = data.category;
    if (data.description !== undefined) item.description = data.description;
    if (data.rawCode !== undefined) item.rawCode = data.rawCode;
    if (data.isFeatured !== undefined) item.isFeatured = Boolean(data.isFeatured);

    item.updatedAt = new Date();
    return item;
  }

  delete(id) {
    const index = this.items.findIndex(item => item.id === Number(id) || String(item._id) === String(id));
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  like(id) {
    const item = this.getById(id);
    if (!item) return null;
    item.likes += 1;
    item.updatedAt = new Date();
    return item;
  }

  incrementDownload(id) {
    const item = this.getById(id);
    if (!item) return null;
    item.downloads += 1;
    item.updatedAt = new Date();
    return item;
  }
}

const memoryDb = new InMemoryStore();
module.exports = memoryDb;
