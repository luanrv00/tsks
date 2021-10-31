export default function groupTsksByContext(tsks) {
  const key = 'context'

  return tsks.reduce((objectsByKeyValue, obj) => {
    const context = obj[key];
    objectsByKeyValue[context] = (objectsByKeyValue[context] || []).concat(obj);
    return objectsByKeyValue;
  }, {})
}
