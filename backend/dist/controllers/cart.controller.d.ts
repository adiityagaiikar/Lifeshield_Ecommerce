import { Request, Response, NextFunction } from 'express';
export declare const getMyCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addCartItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateCartItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const removeCartItem: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const clearCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const checkoutCart: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=cart.controller.d.ts.map