"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_cache_1 = __importDefault(require("node-cache"));
var Cache = /** @class */ (function () {
    function Cache() {
        this.cache = new node_cache_1.default({ stdTTL: 15000 });
    }
    Cache.prototype.set = function (key, value) {
        return this.cache.set(key, value);
    };
    Cache.prototype.get = function (key) {
        return this.cache.get(key);
    };
    Cache.prototype.delete = function (key) {
        return this.cache.del(key);
    };
    Cache.prototype.close = function () {
        this.cache.close();
    };
    return Cache;
}());
exports.default = Cache;
