const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/bill")
    },
    filename: function (req, file, cb) {
      
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
// export const upload = multer({ 
//     storage, 
// })

module.exports = storage