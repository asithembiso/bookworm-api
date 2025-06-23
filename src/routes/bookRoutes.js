import express from "express";
import cloudinary from "../lib/cloudinary.js"
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Creates a new book entry for the authenticated user, uploads image to Cloudinary.
 */
router.post("/", protectRoute, async (req, res) => {
    try {
        const {title, caption, rating, image} = req.body;
        if(!title || !caption || !rating || !image) return res.status(400).json({message: "Please provide all fields"});
        
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;
     
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user_id
        });

        await newBook.save();
        res.status(201).json(newBook)
    } catch (error) {
        console.log("Error in creating new book", error)
        res.status(500).json({message: "Internal server error"})
    }
});

/**
 * Gets all books (paginated) for all users.
 */
router.get("/", protectRoute, async(req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.page || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });
    } catch (error) {
        console.log("Error getting all books", error)
        res.status(500).json({message: "Internal server error"})
    }
});

/**
 * Gets all books for the authenticated user.
 */
router.get("/user", protectRoute, async(req, res) => {
    try {
        const books = await Book.find({user: req.user_id}).sort({createdAt: -1});
        res.status(200).json(books);
    } catch (error) {
        console.log("Error getting user books", error)
        res.status(500).json({message: "Internal server error"})
    }
});

/**
 * Deletes a book by ID if the authenticated user owns it, and removes the image from Cloudinary.
 */
router.delete("/:id", protectRoute, async(req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        if(!book) return res.status(400).json({message: "Book not found"});

        if(book.user.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "Unathorized"});
        }

        if(book.image && book.image.includes("cloudinary")){
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.log("Error deleting image from cloudinary", deleteError)
            }
        }
        await book.deleteOne();
        res.status(200).json({message: "Book deleted successfully"});
    } catch (error) {
        console.log("Error deleting book", error)
        res.status(500).json({message: "Internal server error"})
    }
});

export default router;