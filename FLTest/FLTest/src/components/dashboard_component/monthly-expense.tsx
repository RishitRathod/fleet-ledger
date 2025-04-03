import React from 'react';

const MonthlyExpense = () => {
  return (
    <div className="bg-black rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-2">Monthly Expense</h3>
      <div className="text-4xl font-bold">Rs. 15,000</div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Previous Month</span>
          <span className="text-green-400">+12%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Target</span>
          <span className="text-yellow-400">Rs. 14,500</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpense;
