export function chunkText(
    pages,
    chunkSize = 1000,
    overlap = 200
) {
    const chunks = [];

    for (const page of pages) {
        let start = 0;
        let chunkIndex = 0;

        while (start < page.text.length) {
            chunks.push({
                page: page.page,
                chunkIndex,
                text: page.text.slice(start, start + chunkSize),
            });

            start += chunkSize - overlap;
            chunkIndex++;
        }
    }

    return chunks;
}