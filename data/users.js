import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections.js';
import helpers from '../RDUsershelpers.js';
import bcrypt from 'bcryptjs';

const createUser = async (

    userID,
    userName,
    password,
    userType
    
) => {

    if (!userID || !userName || !password || !userType) {
        throw new Error('You must enter valid inputs for all fields.');
    }

    userID = helpers.validateEmail(userID, 'UserID', 7);
    userName = helpers.validateString(userName, 'userName', 2);
    password = helpers.validatePassword(password, 'password', 12);
    userType = helpers.validateString(userType, 'userType');    

    const saltRounds = 10;

    const passwordHash = await bcrypt.hash(password, saltRounds);

    

    let newUser = {
        userID,
        userName,
        passwordHash,
        userType,
        userSince: new Date()

        


    }

    const usersCollection = await users();
    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw new Error('Could not add user');
    }
    const newId = insertInfo.insertedId.toString();
    newUser = { _id: newId, ...newUser };

  
    return newUser;
};


const getAllUsers = async () => {

    const usersCollection = await users();
    let usersList = await usersCollection.find({}).toArray();
    if (!usersList) {
      throw 'Could not get all users';
    }
    usersList = usersList.map((element) => {
      element._id = element._id.toString();
      return element;
    }
  );
  return usersList;
  };


  const getUserById = async (id) => {
  
    id = helpers.checkId(id);
    
    const usersCollection = await users();
    const user = await usersCollection.findOne({_id: new ObjectId(id)});
    if (user === null) throw 'No user with that id';
    user._id = user._id.toString();
    return user;
};

const removeUser = async (id) => {
    id = helpers.checkId(id); 
      
      const usersCollection = await users();
  
      console.log("Users collection:", usersCollection);
  
      const deletionInfo = await usersCollection.findOneAndDelete({
        _id: new ObjectId(id)
      });
  
      console.log("Deletion info", deletionInfo);
  
      if (!deletionInfo.value) {
        throw `Could not delete user with id of ${id}`;
      }
      return `User with ID of ${id} has been deleted.`;
    
  };

  const updateUser = async (
    id,
    updatedUserData
  ) => {
    if (!id || !updatedUserData) {
      throw new Error('All inputs must have valid values');
    }
  
    
  
    id = new ObjectId(helpers.checkId(id));
  
    const updatedUser = {
  
      userId: helpers.validateEmail(updatedUserData.userId, 'userId', 7),
      password: helpers.validatePassword(updatedUserData.password, 'password', 12),
      userName: helpers.validateString(updatedUserData.userName, 'userName', 12),
      userType: helpers.validateString(updatedUserData.userType, 'userType')
      
    };
  
    const usersCollection = await users();
      const user = await usersCollection.findOneAndUpdate(
        { _id: id }, 
        { $set: updatedUser },
      { returnDocument: 'after' }
    );
  
    console.log('findOneAndUpdate result:', user);
  
  
    if (!user.value) {
      const existingUser = await usersCollection.findOne({ _id: id });
      if (existingUser) {
        console.log('Returning the existing user:', existingUser);
  
        return existingUser;
      }
      throw new Error('No user found with the given ID');
    }
    
    console.log('Successfully updated user:', user.value);
  
    return user.value;s
  
  
  };

  const userMethods = { createUser, getAllUsers, getUserById, removeUser, updateUser };

  export default userMethods;