"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/language/language-context"
import { formatVND } from "@/lib/utils"

interface Category {
  key: string
  label: string
}

interface ProductFiltersProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRange: number[]
  onPriceRangeChange: (range: number[]) => void
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: ProductFiltersProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("category")}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
            {categories.map((category) => (
              <div key={category.key} className="flex items-center space-x-2">
                <RadioGroupItem value={category.key} id={category.key} />
                <Label htmlFor={category.key} className="cursor-pointer">
                  {category.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("price")} Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={onPriceRangeChange} max={10000000} min={0} step={100000} className="w-full" />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatVND(priceRange[0])}</span>
            <span>{formatVND(priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
