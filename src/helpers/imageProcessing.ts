import Jimp from "jimp";

export async function clearImage(imgPath: string): Promise<Jimp> {
	const jimp = await Jimp.read(imgPath);
	return jimp
		.resize(400, Jimp.AUTO)
		.color([{ apply: "desaturate", params: [20] } as any])
		.contrast(1)
		.normalize();
}

export async function getImageBuffer(imgJimp: Jimp): Promise<Buffer> {
	return await imgJimp.getBufferAsync(Jimp.MIME_PNG);
}
