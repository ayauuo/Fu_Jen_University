export interface TemplateSlot {
  x: number
  y: number
  w: number
  h: number
}

/**
 * 拍照畫面專用：可依版型帶入不同佈局參數，供 CSS / 樣式使用
 */
export interface TemplateShootLayout {
  /** 佈局類型（對應 CSS class，例如 layout-grid-4、layout-grid-2） */
  layoutKey?: string
  /** 左側縮圖區寬度（px 或 %） */
  thumbPanelWidth?: string
  /** 拍照區寬、高（px），可驅動 CSS 變數 */
  captureW?: number
  captureH?: number
  previewScale?: number
  /** 拍照頁預覽框等比縮放（1=不變；0.8=寬高皆×0.8，維持框圖比例避免 contain 留白黑邊） */
  previewWidthScale?: number
  /**
   * 框圖顯示尺寸（換新框圖時設為新圖的寬高，video / 預覽區會用這個尺寸）
   * 不設則用 captureW / captureH
   */
  displayW?: number
  displayH?: number
  /** 各框的佔位圖路徑前綴（例如 ShootPage/bk01） */
  framePathPrefix?: string
  /** 自訂 CSS 變數（會掛在拍照畫面根節點） */
  cssVars?: Record<string, string>
}

export interface Template {
  id: string
  /** 選版型畫面顯示的名稱（標題在預覽圖上方） */
  chooseLabel: string
  preview: string
  shotCount: number
  sizeKey: string
  captureW: number
  captureH: number
  stageSize: { maxWidth: string; maxHeight: string }
  frameAspectRatio: string
  width: number
  height: number
  slots: TemplateSlot[]
  /**
   * 合成格數（slots.length）可大於實際拍到的張數：buildFinalOutput 會依序循環使用
   * captureResults（例：2 張照、4 格 → 第 1、2 張再重複貼第 3、4 格）。
   */
  shootLayout?: TemplateShootLayout
}

export type ScreenName =
  | 'idle'
  | 'template'
  | 'shoot'
  | 'result'
  | 'result-no-qr'
  | 'uploading'
  | 'processing'
  | 'camera-test'
  | 'test-filter'
  | 'db-view'

export type FilterId =
  | 'baby-pink'
  | 'clear-blue'
  | 'vintage-retro'
  | 'fresh-korean'
  | 'soft-milk-tea'
  | 'neutral-gray'