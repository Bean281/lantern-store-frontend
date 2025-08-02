"use client"
import { Phone, MapPin, Store } from "lucide-react"
import { useLanguage } from "@/components/language/language-context"

export function Footer() {
  const { language } = useLanguage()

  const storeInfo = {
    name: "Lồng đèn truyền thống ông Vương",
    phone: "0933724208",
    address: "Địa chỉ 100/10 đường 4, tam phú, thủ đức"
  }

  return (
    <footer className="bg-background border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Store Name */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <Store className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg text-foreground">
                {language === "en" ? "Lồng đèn truyền thống ông Vương" : storeInfo.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === "en" 
                ? "Xưởng Lồng Đèn gia truyền, lồng đèn các loại" 
                : "Xưởng Lồng Đèn gia truyền, lồng đèn các loại"
              }
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-5 w-5 text-primary" />
              <h4 className="font-medium text-foreground">
                {language === "en" ? "Liên hệ" : "Liên hệ"}
              </h4>
            </div>
            <a 
              href={`tel:${storeInfo.phone}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {storeInfo.phone}
            </a>
          </div>

          {/* Address */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h4 className="font-medium text-foreground">
                {language === "en" ? "Địa chỉ" : "Địa chỉ"}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === "en" 
                ? "100/10 Street 4, Tam Phu, Thu Duc" 
                : storeInfo.address
              }
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 {storeInfo.name}. {language === "en" ? "All rights reserved." : "Bảo lưu mọi quyền."}
          </p>
        </div>
      </div>
    </footer>
  )
}