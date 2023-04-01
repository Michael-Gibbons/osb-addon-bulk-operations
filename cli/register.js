import testCommand from './test-command.js'

const register = ({ program }) => {
  program.addCommand(testCommand)
  console.log('This is some cli code!')
}

export {
  register
}