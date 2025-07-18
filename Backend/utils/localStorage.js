// const fs = require("fs");
// const path = require("path");

// const saveFileLocally = async (file, userID, subfolder = '') => {
//     try {
//         if (!file || !file.path) return null;

//         const baseDir = `./uploads/user_${userID}`;
//         const targetDir = subfolder ? path.join(baseDir, subfolder) : baseDir;
        
//         // Create directory if it doesn't exist
//         if (!fs.existsSync(targetDir)) {
//             fs.mkdirSync(targetDir, { recursive: true });
//         }

//         // Generate new filename
//         const timestamp = Date.now();
//         const extension = path.extname(file.originalname);
//         const filename = `${timestamp}-${file.originalname}`;
//         const targetPath = path.join(targetDir, filename);

//         // Move file from temp location to permanent location
//         fs.renameSync(file.path, targetPath);

//         // Return relative path for database storage
//         const relativePath = targetPath.replace('./public/', '/');
        
//         return {
//             url: relativePath,
//             filename: filename,
//             path: targetPath
//         };
        
//     } catch (error) {
//         console.error("Local file save failed:", error);
//         // Clean up temp file if it exists
//         if (file && file.path && fs.existsSync(file.path)) {
//             fs.unlinkSync(file.path);
//         }
//         return null;
//     }
// };

// const deleteFileLocally = async (filePath) => {
//     try {
//         // Handle both full URLs and relative paths
//         let relativePath = filePath;
//         if (filePath.startsWith('http')) {
//             // Extract relative path from full URL
//             const urlObj = new URL(filePath);
//             relativePath = urlObj.pathname;
//         }
        
//         const fullPath = `./public${relativePath}`;
//         if (fs.existsSync(fullPath)) {
//             fs.unlinkSync(fullPath);
//             return true;
//         }
//         return false;
//     } catch (error) {
//         console.error("File deletion failed:", error);
//         return false;
//     }
// };

// module.exports = {
//     saveFileLocally,
//     deleteFileLocally
// };