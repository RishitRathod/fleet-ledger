"use client"

import { AccessoriesExpenseModal } from "./accessories-expense"
import { FuelExpenseModal } from "./fuel-expense"
import { ServiceExpenseModal } from "./service-expense"
import { TaxExpenseModal } from "./tax-expense"

export function ExpenseModals() {
  return (
    <>
      <AccessoriesExpenseModal />
      <FuelExpenseModal />
      <ServiceExpenseModal />
      <TaxExpenseModal />
    </>
  )
}

export { useExpenseModal } from "./expense-store"
