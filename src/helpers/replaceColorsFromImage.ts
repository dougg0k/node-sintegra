import Jimp from "jimp";
import replaceColor from "replace-color";
import { isObjectEmpty } from "../utils/utils";

export async function removeColorsFromImage(
	imgPath: Buffer,
	colorsToReplace: Array<{ targetColor: string; newColor: string }>,
): Promise<any> {
	return colorsToReplace.reduce(async (acc: any, curr, index) => {
		try {
			if (index === 0) {
				acc = await replaceColor({
					image: imgPath,
					colors: {
						type: "hex",
						targetColor: curr.targetColor,
						replaceColor: curr.newColor,
					},
					deltaE: 0,
				});
			} else {
				if (!isObjectEmpty(acc)) {
					acc = await replaceColor({
						image: await acc?.getBufferAsync(Jimp.MIME_PNG),
						colors: {
							type: "hex",
							targetColor: curr.targetColor,
							replaceColor: curr.newColor,
						},
						deltaE: 0,
					});
				}
			}
			return acc;
		} catch (err) {
			throw err;
		}
	}, {});
}
