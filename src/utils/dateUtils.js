export const dateFormat=(time_str)=>{
    let time;
    if(time_str){
        time=new Date(time_str);
    }else{
        time=new Date();
    }

    let month=time.getMonth()<9?'0'+(time.getMonth()+1):(time.getMonth()+1);
    let day=time.getDate()<10?'0'+time.getDate():time.getDate();
    let str=time.getFullYear()+'-'+month+'-'+day+' '+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
    return str;
}