import { useState, useEffect, useCallback } from 'react'
import type { ProductEntity, StorageOption, ColorOption } from '../types/api'

type UseProductOptionsReturn = {
  selectedStorage: StorageOption
  selectedColor: ColorOption
  setSelectedStorage: (storage: StorageOption) => void
  setSelectedColor: (color: ColorOption) => void
  resetSelections: () => void
  isValidSelection: boolean
  isInitialized: boolean
}

type UseProductOptionsOptions = {
  product: ProductEntity | null
  onSelectionChange?: (selections: {
    storage: StorageOption
    color: ColorOption
  }) => void
}

export const useProductOptions = ({
  product,
  onSelectionChange,
}: UseProductOptionsOptions): UseProductOptionsReturn => {
  const [selectedStorage, setSelectedStorageState] =
    useState<StorageOption | null>(null)
  const [selectedColor, setSelectedColorState] = useState<ColorOption | null>(
    null
  )
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (
      !product ||
      !product.storageOptions?.length ||
      !product.colorOptions?.length
    ) {
      setIsInitialized(false)
      return
    }

    const defaultStorage = product.storageOptions[0]
    const defaultColor = product.colorOptions[0]

    setSelectedStorageState(defaultStorage)
    setSelectedColorState(defaultColor)
    setIsInitialized(true)
  }, [product])

  useEffect(() => {
    if (
      onSelectionChange &&
      isInitialized &&
      selectedStorage &&
      selectedColor
    ) {
      onSelectionChange({
        storage: selectedStorage,
        color: selectedColor,
      })
    }
  }, [selectedStorage, selectedColor, onSelectionChange, isInitialized])

  const setSelectedStorage = useCallback((storage: StorageOption) => {
    setSelectedStorageState(storage)
  }, [])

  const setSelectedColor = useCallback((color: ColorOption) => {
    setSelectedColorState(color)
  }, [])

  const resetSelections = useCallback(() => {
    if (!product?.storageOptions?.length || !product?.colorOptions?.length)
      return

    const defaultStorage = product.storageOptions[0]
    const defaultColor = product.colorOptions[0]

    setSelectedStorageState(defaultStorage)
    setSelectedColorState(defaultColor)
  }, [product])

  console.log('storageoptions----', product?.storageOptions)

  const isValidSelection = Boolean(
    isInitialized &&
      selectedStorage &&
      selectedColor &&
      product?.storageOptions?.some(
        s => s.capacity === selectedStorage.capacity
      ) &&
      product?.colorOptions?.some(c => c.hexCode === selectedColor.hexCode)
  )

  // Only return the hook values if initialized, otherwise throw
  if (!isInitialized || !selectedStorage || !selectedColor) {
    return {
      selectedStorage: {} as StorageOption,
      selectedColor: {} as ColorOption,
      setSelectedStorage,
      setSelectedColor,
      resetSelections,
      isValidSelection: false,
      isInitialized,
    }
  }

  return {
    selectedStorage,
    selectedColor,
    setSelectedStorage,
    setSelectedColor,
    resetSelections,
    isValidSelection,
    isInitialized,
  }
}
