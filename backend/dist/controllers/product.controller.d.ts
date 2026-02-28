import { Request, Response } from 'express';
export declare const getProducts: (req: Request, res: Response) => Promise<void>;
export declare const getProductById: (req: Request, res: Response) => Promise<void>;
export declare const createProduct: (req: Request, res: Response) => Promise<void>;
export declare const updateProduct: (req: Request, res: Response) => Promise<void>;
export declare const createProductReview: (req: Request, res: Response) => Promise<void>;
/**
 * Data Mining Aggregation Controller
 * Analyzes recent purchases and assessments in a specific region to calculate
 * demand velocity and flag high demand products.
 */
export declare const getHighDemandProductsByRegion: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=product.controller.d.ts.map