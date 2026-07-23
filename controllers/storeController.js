/**
 * Store Controller for Riyad Store API
 * Manages all command store operations with Mongoose DB / Memory Store synchronization
 */

const mongoose = require('mongoose');
const StoreItem = require('../models/StoreItem');
const inMemoryDb = require('../utils/inMemoryDb');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const compareVersions = require('../utils/versionCompare');
const isMongoActive = () => mongoose.connection.readyState === 1;

/**
 * GET /api/store/list
 * List commands with optional filtering (category, author, sort, page, limit)
 */
exports.getList = async (req, res, next) => {
  try {
    const { category, author, sort = 'newest', page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    if (isMongoActive()) {
      const query = {};
      if (category) query.category = new RegExp(`^${category}$`, 'i');
      if (author) query.author = new RegExp(`^${author}$`, 'i');

      let sortOptions = { createdAt: -1 };
      if (sort === 'trending' || sort === 'popular') sortOptions = { downloads: -1, likes: -1 };
      else if (sort === 'downloads') sortOptions = { downloads: -1 };
      else if (sort === 'likes') sortOptions = { likes: -1 };
      else if (sort === 'featured') sortOptions = { isFeatured: -1, createdAt: -1 };

      const total = await StoreItem.countDocuments(query);
      const items = await StoreItem.find(query).sort(sortOptions).skip(skip).limit(limitNum);

      return successResponse(res, 200, 'Store commands retrieved successfully', items, {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
    } else {
      // Memory Fallback
      const filtered = inMemoryDb.search('', category, author, sort);
      const paginated = filtered.slice(skip, skip + limitNum);

      return successResponse(res, 200, 'Store commands retrieved successfully (Local Store)', paginated, {
        total: filtered.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filtered.length / limitNum),
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/store/search?q=
 * Search commands by query string
 */
exports.search = async (req, res, next) => {
  try {
    const { q = '', category = '', author = '', sort = 'newest' } = req.query;

    if (!q.trim() && !category && !author) {
      return exports.getList(req, res, next);
    }

    if (isMongoActive()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      const query = {
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { author: searchRegex },
          { rawCode: searchRegex }
        ]
      };

      if (category) query.category = new RegExp(`^${category}$`, 'i');
      if (author) query.author = new RegExp(`^${author}$`, 'i');

      const items = await StoreItem.find(query).sort({ downloads: -1, likes: -1 });
      return successResponse(res, 200, `Search results for "${q}"`, items, { total: items.length });
    } else {
      const items = inMemoryDb.search(q, category, author, sort);
      return successResponse(res, 200, `Search results for "${q}"`, items, { total: items.length });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/store/info/:id
 * Get single command details by id
 */
exports.getInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item = null;

    if (isMongoActive()) {
      if (Number.isInteger(Number(id))) {
        item = await StoreItem.findOne({ id: Number(id) });
      }
      if (!item && mongoose.Types.ObjectId.isValid(id)) {
        item = await StoreItem.findById(id);
      }
    }

    if (!item) {
      item = inMemoryDb.getById(id);
    }

    if (!item) {
      return errorResponse(res, 404, `Command with ID "${id}" not found.`);
    }

    return successResponse(res, 200, 'Command information retrieved', item);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/store/raw/:id
 * Return raw JavaScript code directly for bot framework execution
 */
exports.getRawCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item = null;

    if (isMongoActive()) {
      if (Number.isInteger(Number(id))) {
        item = await StoreItem.findOne({ id: Number(id) });
      }
      if (!item && mongoose.Types.ObjectId.isValid(id)) {
        item = await StoreItem.findById(id);
      }
    }

    if (!item) {
      item = inMemoryDb.getById(id);
    }

    if (!item) {
      return res.status(404).send(`// Error: Command with ID "${id}" not found on Riyad Store API`);
    }

    // Auto increment download count on raw code request
    if (isMongoActive() && item._id) {
      await StoreItem.findByIdAndUpdate(item._id, { $inc: { downloads: 1 } });
    }
    inMemoryDb.incrementDownload(id);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(item.rawCode);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/store/upload
 * Upload a new command plugin
 */
exports.upload = async (req, res, next) => {
  try {
    const {
      name,
      version,
      author,
      category,
      description,
      rawCode,
      isFeatured
    } = req.body;

    let newItem = null;

    if (isMongoActive()) {
      const existing = await StoreItem.findOne({ name });

      if (!existing) {
        const created = await StoreItem.create({
          name,
          version: version || "1.0.0",
          author: author || "Anonymous",
          category: category || "General",
          description: description || "",
          rawCode,
          isFeatured: Boolean(isFeatured)
        });

        newItem = created.toObject();
      } else {
        return errorResponse(
          res,
          409,
          "Command already exists. Version compare will be added in the next step."
        );
      }
    }

    // Always keep memory store updated for cross-sync
    const memItem = inMemoryDb.add({
      name,
      version,
      author,
      category,
      description,
      rawCode,
      isFeatured,
    });

    const result = newItem || memItem;

    return successResponse(res, 201, 'Command plugin uploaded successfully to Riyad Store', result);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/store/update/:id
 * Update an existing command
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, version, author, category, description, rawCode, isFeatured } = req.body;

    let updated = null;

    if (isMongoActive()) {
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (version !== undefined) updateData.version = version;
      if (author !== undefined) updateData.author = author;
      if (category !== undefined) updateData.category = category;
      if (description !== undefined) updateData.description = description;
      if (rawCode !== undefined) updateData.rawCode = rawCode;
      if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);

      if (Number.isInteger(Number(id))) {
        updated = await StoreItem.findOneAndUpdate({ id: Number(id) }, updateData, { new: true });
      }
      if (!updated && mongoose.Types.ObjectId.isValid(id)) {
        updated = await StoreItem.findByIdAndUpdate(id, updateData, { new: true });
      }
    }

    const memUpdated = inMemoryDb.update(id, { name, version, author, category, description, rawCode, isFeatured });

    const finalItem = updated || memUpdated;

    if (!finalItem) {
      return errorResponse(res, 404, `Command with ID "${id}" not found to update.`);
    }

    return successResponse(res, 200, 'Command updated successfully', finalItem);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/store/delete/:id
 * Delete a command plugin
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (isMongoActive()) {
      if (Number.isInteger(Number(id))) {
        const resMongo = await StoreItem.findOneAndDelete({ id: Number(id) });
        if (resMongo) deleted = true;
      }
      if (!deleted && mongoose.Types.ObjectId.isValid(id)) {
        const resMongo = await StoreItem.findByIdAndDelete(id);
        if (resMongo) deleted = true;
      }
    }

    const memDeleted = inMemoryDb.delete(id);
    if (memDeleted) deleted = true;

    if (!deleted) {
      return errorResponse(res, 404, `Command with ID "${id}" not found for deletion.`);
    }

    return successResponse(res, 200, `Command with ID "${id}" deleted successfully.`);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/store/like/:id
 * Increment like counter
 */
exports.like = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item = null;

    if (isMongoActive()) {
      if (Number.isInteger(Number(id))) {
        item = await StoreItem.findOneAndUpdate({ id: Number(id) }, { $inc: { likes: 1 } }, { new: true });
      }
      if (!item && mongoose.Types.ObjectId.isValid(id)) {
        item = await StoreItem.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
      }
    }

    const memItem = inMemoryDb.like(id);
    const finalItem = item || memItem;

    if (!finalItem) {
      return errorResponse(res, 404, `Command with ID "${id}" not found to like.`);
    }

    return successResponse(res, 200, 'Command liked successfully', {
      id: finalItem.id || id,
      likes: finalItem.likes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/store/download/:id
 * Increment download counter
 */
exports.download = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item = null;

    if (isMongoActive()) {
      if (Number.isInteger(Number(id))) {
        item = await StoreItem.findOneAndUpdate({ id: Number(id) }, { $inc: { downloads: 1 } }, { new: true });
      }
      if (!item && mongoose.Types.ObjectId.isValid(id)) {
        item = await StoreItem.findByIdAndUpdate(id, { $inc: { downloads: 1 } }, { new: true });
      }
    }

    const memItem = inMemoryDb.incrementDownload(id);
    const finalItem = item || memItem;

    if (!finalItem) {
      return errorResponse(res, 404, `Command with ID "${id}" not found to record download.`);
    }

    return successResponse(res, 200, 'Download counter updated', {
      id: finalItem.id || id,
      downloads: finalItem.downloads,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/store/categories
 * List distinct categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    let categories = [];
    if (isMongoActive()) {
      categories = await StoreItem.distinct('category');
    }
    
    if (!categories || categories.length === 0) {
      const all = inMemoryDb.getAll();
      categories = Array.from(new Set(all.map(i => i.category)));
    }

    return successResponse(res, 200, 'Distinct categories retrieved', categories);
  } catch (error) {
    next(error);
  }
};
