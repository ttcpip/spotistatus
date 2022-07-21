import { prompt } from 'enquirer';

export async function promptStr(message: string, isPassword = false) {
  return (
    await prompt<{ _: string }>({
      type: isPassword ? 'password' : 'input',
      message,
      name: '_',
    })
  )._;
}
