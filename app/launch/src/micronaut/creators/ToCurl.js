export default class ToCurl {
  static make(createCommand) {
    const { name } = createCommand
    return `curl --location --request GET '${createCommand.toUrl(
      'create'
    )}' --output ${name}.zip`
  }
}
