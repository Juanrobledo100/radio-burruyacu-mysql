const API_BASE_URL = (
	import.meta.env.VITE_API || (import.meta.env.DEV ? "http://localhost:5000" : "")
).replace(/\/+$/, "");

export const apiUrl = (path = "") => {
	if (!path) return API_BASE_URL;
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${API_BASE_URL}${normalizedPath}`;
};

export const assetUrl = (path, version) => {
	if (!path) return "";
	const url = path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/assets/")
		? path
		: apiUrl(path);
	return version ? `${url}${url.includes("?") ? "&" : "?"}v=${version}` : url;
};

export const apiFetch = async (path, options) => {
	const respuesta = await fetch(apiUrl(path), options);
	if (respuesta.status === 401 && typeof window !== "undefined") {
		window.dispatchEvent(new Event("auth:unauthorized"));
	}
	return respuesta;
};
