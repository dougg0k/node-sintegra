import fetch from "node-fetch";
import estados from "../utils/estados";
import { SintegraAL } from "./Sintegra";

export async function fetchSintegra(cnpj: string): Promise<SintegraAL> {
	try {
		const response = await fetch(estados.ALAGOAS.url, {
			method: "POST",
			body: JSON.stringify({ cnpj }),
			headers: { "Content-Type": "application/json" },
		});
		const data = await response.json();
		if (!data || data.length < 0) {
			throw new Error("Registro não existe");
		}
		return data[0];
	} catch (err) {
		throw err;
	}
}
