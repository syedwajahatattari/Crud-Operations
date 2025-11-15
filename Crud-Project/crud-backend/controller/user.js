import userModel from '../models/user.js';


export const create = async (req, res) => {
    try{
        const userData = new userModel(req.body);
        const {email} = userData;
        const userExist = await userModel.findOne({email});
        if (userExist) {
            return res.status(400).json({message: 'User already exists'});
        }
        await userData.save();
        res.status(201).json({message: 'User created successfully'});
    } catch(error){
        res.status(500).json({message: error.message});

};}

export const getAll = async (req, res) => {
    try{
        const userExist = await userModel.find();
        if (!userExist){
            return res.status(404).json({message: 'No users found'});
        }
        res.status(200).json(userExist);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getOne = async (req, res) => {
    try{
        const {id} = req.params;
        const userExist = await userModel.findById(id);
        if (!userExist){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(userExist);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

export const update = async (req, res) => {
    try {
        const {id} = req.params;
    const userExist = await userModel.findByIdAndUpdate(id, req.body, {new: true});
    if (!userExist){
        return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({message: 'User updated successfully'});

    } catch (error) {
        console.log('Error in update user:', error);
        res.status(500).json({message: error.message});
    }
};

export const remove = async (req, res) => {
    try {
        const {id} = req.params;
    const userExist = await userModel.findByIdAndDelete(id);
    if (!userExist){
        return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({message: 'User deleted successfully'});

    } catch (error) {
        console.log('Error in delete user:', error);
        res.status(500).json({message: error.message});
    }
};