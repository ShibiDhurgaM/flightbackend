const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      }, { new: true }); // Add { new: true } to get the updated user data
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can only update your account!");
  }
});
// DELETE
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        try{
          const user=await User.findById(req.params.id);
      try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted....")
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json(err);
      }
    }catch(err)
    {
       res.status(404).json("User not found!")
    }
    } else {
      res.status(401).json("You can only delete your account!");
    }
  });

  //GET USER

router.get("/:id",async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        const{password,...others}=user._doc;
        res.status(200).json(others)
    }catch(err)
    {
      res.status(500).json(err);
    }
})  
module.exports = router;
