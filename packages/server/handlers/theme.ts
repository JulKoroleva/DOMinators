import { Theme } from '../init';
import { ITheme } from '../models';

export async function getTheme(userId: ITheme['userId']): Promise<ITheme['darkTheme']> {
  const result = await Theme.findOne({ where: { userId } });

  return Boolean(result?.dataValues.darkTheme);
}

export async function setTheme(userId: ITheme['userId'], darkTheme: ITheme['darkTheme']) {
  let result = await Theme.findOne({ where: { userId } });

  if (!result) {
    result = await Theme.create({ userId, darkTheme });
  } else {
    await result.update({ darkTheme });
    await result.save();
  }

  return result;
}
