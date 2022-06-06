export class CommandLine {
  constructor(state) {
    this.state = state;

    this.startProcess();
  }

  startProcess() {
    process.stdin.on('data', (data) => {
      const str = data.toString().trim();
      

      this.state.setState({
        [`${str + 0}`]: str
      });

      console.log(this.state.getState());
      this.printCurrentPathToWorkingDir()
      if (str === '.exit') {
        this.closeProccess();
      }
    });
    process.on('SIGINT', this.closeProccess);
  }

  closeProccess() {
    process.stdout.write(`Thank you for using File Manager, ${this.username} \n`);
    process.exit(0);
  }

  printCurrentPathToWorkingDir() {
    const dir = this.state.getState().currentPathDir;

    console.log(`You are currently in ${dir}`)
  }
}