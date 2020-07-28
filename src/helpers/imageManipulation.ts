import gm from "gm";
import Jimp from "jimp";
import replaceColor from "replace-color";

export async function clearImage(imgPath: string): Promise<Jimp> {
	const jimp = await Jimp.read(imgPath);
	return jimp
		.resize(400, Jimp.AUTO)
		.color([{ apply: "desaturate", params: [0] } as any])
		.contrast(1)
		.normalize();
}

export async function getImageBuffer(imgJimp: Jimp): Promise<Buffer> {
	return await imgJimp.getBufferAsync(Jimp.MIME_PNG);
}

export function convertImageToBase64(image: Buffer): string {
	return Buffer.from(image).toString("base64");
}

export function applyFilters(img: Buffer): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		gm(img)
			.median(3)
			.enhance()
			.toBuffer("PNG", function (err: Error | null, buffer: Buffer) {
				if (err) {
					reject(err);
				}
				resolve(buffer);
			});
	});
}

export async function replaceColorsFromImage(
	img: Buffer,
	colorsToReplace: Array<{ targetColor: string; newColor: string }> = [],
): Promise<Jimp> {
	if (colorsToReplace.length > 0) {
		return colorsToReplace.reduce(async (acc: any, curr, index) => {
			try {
				if (index === 0) {
					acc = await replaceColor({
						image: img,
						colors: {
							type: "hex",
							targetColor: curr.targetColor,
							replaceColor: curr.newColor,
						},
						deltaE: 0,
					});
				} else {
					const accJimp = await acc;
					acc = await replaceColor({
						image: await getImageBuffer(accJimp),
						colors: {
							type: "hex",
							targetColor: curr.targetColor,
							replaceColor: curr.newColor,
						},
						deltaE: 0,
					});
				}
				return acc;
			} catch (err) {
				throw err;
			}
		}, {});
	}
	return await Jimp.read(img);
}
