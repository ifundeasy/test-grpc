/* eslint-disable object-curly-newline */

let Id = 5;
const Data = [
  { id: 1, title: 'Lorem ipsum', chapters: 12 },
  { id: 2, title: 'Morbi a turpis', chapters: 3 },
  { id: 3, title: 'Sed nec sodales', chapters: 88, notes: 'remake' },
  { id: 4, title: 'Orci varius', chapters: 2, notes: 'uncensored' },
];

module.exports = {
  create(data) {
    if (!data) throw new Error('Empty!')

    Id += 1;

    const row = {
      ...data,
      id: Id,
    };
    Data.push(row);

    return row
  },
  getBy(options = {}) {
    return Data.filter(el => {
      const map = Object.entries(options).map(([key, value]) => el[key] === value)
      return map.indexOf(false) > -1 ? 0 : 1
    })
  },
  getById(id) {
    return this.getBy({ id })[0]
  },
  deleteBy(options = {}) {
    const index = []
    Data.forEach((el, idx) => {
      const map = Object.entries(options).map(([key, value]) => el[key] === value)
      if (map.indexOf(false) === -1) index.push({ idx, el })
    });
    index.forEach((data, i) => {
      Data.splice(data.idx, 1)
    })
    return index.map(data => data.el.id);
  },
  deleteById(id) {
    return this.deleteBy({ id })[0]
  },
  updateBy(data, options) {
    return Data.filter(el => {
      const map = Object.entries(options).map(([key, value]) => el[key] === value)
      if (map.indexOf(false) > -1) return 0

      Object.assign(el, {
        ...data,
        id: el.id // * this makes you unable to update an id
      });
      return 1
    })
  },
  updateById(data, id) {
    return this.updateBy(data, { id })[0]
  }
};
