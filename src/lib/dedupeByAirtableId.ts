/** Keep one visible card for a business synchronized twice with the same Airtable ID.
 * The legacy import sometimes uses recXXXX as its primary key, while the newer
 * synchronized row stores that same key in id_airtable. Do not delete the old row:
 * it may still be referenced by a saved public link.
 */
export function dedupeByAirtableId<T extends { id: string; id_airtable?: string | null }>(items: T[]): T[] {
  const result: T[] = [];
  const index = new Map<string, number>();
  for (const item of items) {
    const sourceId = item.id_airtable || (/^rec[A-Za-z0-9]{14}$/.test(item.id) ? item.id : '');
    if (!sourceId) { result.push(item); continue; }
    const existing = index.get(sourceId);
    if (existing === undefined) {
      index.set(sourceId, result.length);
      result.push(item);
    } else if (item.id_airtable && !result[existing].id_airtable) {
      // The canonical synchronized row wins over its legacy alias.
      result[existing] = item;
    }
  }
  return result;
}
