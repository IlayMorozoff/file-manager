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
}