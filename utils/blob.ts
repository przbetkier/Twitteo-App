export const getBlobFromUri = async (uri: string) => {
    const response = await fetch(uri);
    return await response.blob();
}
