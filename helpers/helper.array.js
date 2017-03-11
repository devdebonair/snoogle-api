exports.paginate = (options = { items: [], pageSize: 25 }) => {
    const numberOfItems = options.items.length;
    const numberOfPages = Math.ceil(numberOfItems / options.pageSize);
    let pages = [];
    for(let i = 0; i < numberOfPages; i++) {
        const start = i * options.pageSize;
        const end = start + options.pageSize;
        let page = options.items.slice(start, end);
        pages.push(page);
    }
    return pages;
};