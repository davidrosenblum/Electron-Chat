// this is for testing the child_process module! 

class ChildProgram{
    constructor(){
        let input = process.env.INPUT;

        console.log(`Got input=${input}`);
    }
}

if(require.main === module){
    new ChildProgram();
}