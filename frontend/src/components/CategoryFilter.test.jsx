// ─────────────────────────────────────────────
// 元件測試：CategoryFilter（類別篩選）
// ─────────────────────────────────────────────
// 元件測試在確認：
//   「使用者做了某個操作，畫面/行為有沒有正確反應」
//
// React Testing Library 的核心理念：
//   「像真實使用者一樣測試」— 不測內部 state，測看得見的結果
//
// 常用方法：
//   render(<元件 />)         → 把元件渲染到測試環境
//   screen.getByText('文字')  → 找到畫面上有這個文字的元素
//   screen.getByRole('button')→ 找到按鈕
//   userEvent.click(element)  → 模擬使用者點擊
//   expect(el).toHaveClass()  → 確認元素有某個 CSS class

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryFilter from './CategoryFilter'

describe('CategoryFilter 類別篩選元件', () => {

  it('應該顯示所有類別按鈕', () => {
    // vi.fn() 建立一個「假函式」，用來確認它有沒有被呼叫
    const onSelect = vi.fn()
    render(<CategoryFilter selected="" onSelect={onSelect} />)

    // 確認「全部」按鈕存在於畫面
    expect(screen.getByText('全部')).toBeInTheDocument()
    // 確認「海邊」按鈕存在
    expect(screen.getByText('海邊')).toBeInTheDocument()
    expect(screen.getByText('山區')).toBeInTheDocument()
  })

  it('點擊類別時，應該呼叫 onSelect 並帶入正確的值', async () => {
    // userEvent.setup()：建立使用者事件模擬器（非同步操作需要 setup）
    const user = userEvent.setup()
    const onSelect = vi.fn()  // 假函式，記錄有沒有被呼叫、帶什麼參數

    render(<CategoryFilter selected="" onSelect={onSelect} />)

    // 模擬使用者點擊「海邊」
    await user.click(screen.getByText('海邊'))

    // 確認 onSelect 被呼叫了一次，而且參數是 '海邊'
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('海邊')
  })

  it('已選取的類別應該有不同的樣式', () => {
    const onSelect = vi.fn()
    render(<CategoryFilter selected="山區" onSelect={onSelect} />)

    // 找到「山區」按鈕，確認它有選取狀態的 CSS class
    const 山區btn = screen.getByText('山區').closest('button')
    expect(山區btn).toHaveClass('border-gray-900')  // 選取時的底線顏色

    // 「海邊」沒被選取，不應該有選取樣式
    const 海邊btn = screen.getByText('海邊').closest('button')
    expect(海邊btn).not.toHaveClass('border-gray-900')
  })

})
