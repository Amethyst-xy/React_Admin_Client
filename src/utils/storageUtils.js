import store from "store";

const USER_KEY='user_key';

const storeOptions={
    //添加user
    addUser:(user)=>store.set(USER_KEY,user),

    //读取user
    getUser:()=>store.get(USER_KEY)||{},

    //删除user
    removeUser:()=>store.remove(USER_KEY)
};

export default storeOptions;