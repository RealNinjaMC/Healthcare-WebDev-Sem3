import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import FormField from '../components/FormField.jsx'
import Modal from '../components/Modal.jsx'
import { useToast } from '../hooks/useToast.js'
import { list, remove, update } from '../lib/api.js'
import { calcTotal, formatMoney, MAX_QUANTITY } from '../lib/pricing.js'
import { isFutureOrToday, isIntInRange, todayString, validate } from '../lib/validators.js'
import { APP } from '../config.js'

const EDIT_RULES = {
  date: [[isFutureOrToday, 'Choose today or a future date']],
  quantity: [[(value) => isIntInRange(value, 1, MAX_QUANTITY), `Quantity must be a whole number from 1 to ${MAX_QUANTITY}`]],
}

const COLUMNS = [
  { key: 'itemName', label: APP.itemLabel },
  { key: 'date', label: 'Date' },
  { key: 'quantity', label: 'Qty' },
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'total', label: 'Total', render: (row) => <span className="font-semibold">{formatMoney(row.total)}</span> },
]

export default function Bookings({ user, setPage }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [editErrors, setEditErrors] = useState({})
  const [deleting, setDeleting] = useState(null)
  const toast = useToast()

  useEffect(() => {
    list(APP.entity.table)
      .then((all) => setRows(all.filter((row) => row.userId === user.id)))
      .catch((error) => toast.show(error.message, 'error'))
      .finally(() => setLoading(false))
  }, [user.id, toast])

  const query = search.trim().toLowerCase()
  const visibleRows = rows.filter((row) =>
    [row.name, row.itemName, row.date].some((field) => String(field ?? '').toLowerCase().includes(query)),
  )
  const totalSpent = rows.reduce((sum, row) => sum + Number(row.total || 0), 0)

  function startEdit(row) {
    setEditing({ id: row.id, itemId: row.itemId, date: row.date, quantity: String(row.quantity), notes: row.notes ?? '' })
    setEditErrors({})
  }

  function handleEditChange(event) {
    const { name, value } = event.target
    setEditing((current) => ({ ...current, [name]: value }))
    setEditErrors((current) => ({ ...current, [name]: undefined }))
  }

  const editItem = APP.items.find((item) => item.id === editing?.itemId)
  const editTotal = calcTotal({ price: editItem?.price ?? 0, quantity: editing?.quantity ?? '', taxRate: APP.taxRate }).total

  async function saveEdit(event) {
    event.preventDefault()
    if (!editItem) {
      toast.show(`This ${APP.itemLabel.toLowerCase()} no longer exists. Delete it and book again.`, 'error')
      return
    }
    const foundErrors = validate(editing, EDIT_RULES)
    setEditErrors(foundErrors)
    if (Object.keys(foundErrors).length > 0) return

    try {
      const updated = await update(APP.entity.table, editing.id, {
        date: editing.date,
        quantity: Number(editing.quantity),
        notes: editing.notes.trim(),
        total: editTotal,
      })
      setRows((current) => current.map((row) => (row.id === updated.id ? updated : row)))
      setEditing(null)
      toast.show(`${APP.entity.singular} updated`)
    } catch (error) {
      toast.show(error.message, 'error')
    }
  }

  async function confirmDelete() {
    try {
      await remove(APP.entity.table, deleting.id)
      setRows((current) => current.filter((row) => row.id !== deleting.id))
      toast.show(`${APP.entity.singular} cancelled`, 'info')
    } catch (error) {
      toast.show(error.message, 'error')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My {APP.entity.plural}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-brand-100 px-3 py-1 font-medium text-brand-800">
              {rows.length} {rows.length === 1 ? APP.entity.singular.toLowerCase() : APP.entity.plural.toLowerCase()}
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-800">Total spent {formatMoney(totalSpent)}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, item or date"
            aria-label="Search"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 sm:w-64"
          />
          <button
            onClick={() => setPage('book')}
            className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
          >
            + New
          </button>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-center text-slate-500">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">You have no {APP.entity.plural.toLowerCase()} yet.</p>
            <button
              onClick={() => setPage('book')}
              className="mt-4 rounded-lg bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700"
            >
              Book now
            </button>
          </div>
        ) : (
          <DataTable
            columns={COLUMNS}
            rows={visibleRows}
            emptyText={`No ${APP.entity.plural.toLowerCase()} match "${search}".`}
            actions={(row) => (
              <div className="flex justify-end gap-2">
                <button onClick={() => startEdit(row)} className="rounded-md bg-slate-100 px-3 py-1 font-medium text-slate-700 hover:bg-slate-200">
                  Edit
                </button>
                <button onClick={() => setDeleting(row)} className="rounded-md bg-rose-50 px-3 py-1 font-medium text-rose-700 hover:bg-rose-100">
                  Delete
                </button>
              </div>
            )}
          />
        )}
      </div>

      <Modal open={editing !== null} title={`Edit ${APP.entity.singular.toLowerCase()}`} onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={saveEdit} noValidate className="flex flex-col gap-4">
            <p className="text-sm text-slate-500">
              {editItem ? editItem.name : 'Unknown item'}
            </p>
            <FormField label="Date" name="date" type="date" value={editing.date} onChange={handleEditChange} error={editErrors.date} min={todayString()} />
            <FormField
              label="Quantity"
              name="quantity"
              type="number"
              value={editing.quantity}
              onChange={handleEditChange}
              error={editErrors.quantity}
              min={1}
              max={MAX_QUANTITY}
            />
            <FormField label="Notes" name="notes" type="textarea" value={editing.notes} onChange={handleEditChange} />
            <p className="flex justify-between font-semibold">
              <span>New total</span>
              <span className="text-brand-700">{formatMoney(editTotal)}</span>
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">
                Save changes
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={deleting !== null} title={`Cancel ${APP.entity.singular.toLowerCase()}?`} onClose={() => setDeleting(null)}>
        {deleting && (
          <div className="flex flex-col gap-4">
            <p className="text-slate-600">
              This will permanently remove <strong>{deleting.itemName}</strong> on <strong>{deleting.date}</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleting(null)} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100">
                Keep it
              </button>
              <button onClick={confirmDelete} className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white hover:bg-rose-700">
                Yes, delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
