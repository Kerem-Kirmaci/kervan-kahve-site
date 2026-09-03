// Kervan Kahve — ürün görseli zemin temizleyici
//
// macOS Vision çerçevesinin öne çıkan nesne maskesini kullanır; model indirmez,
// cihaz üzerinde çalışır. Çıktı: şeffaf zeminli, nesneye kırpılmış PNG.
//
// derle:   swiftc -O tools/kesit.swift -o tools/kesit
// kullan:  tools/kesit <girdi> <çıktı.png>
//
// Çıkış kodları: 0 başarılı, 2 nesne bulunamadı, 1 hata.

import Foundation
import CoreImage
import Vision
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else {
  FileHandle.standardError.write("kullanım: kesit <girdi> <çıktı.png>\n".data(using: .utf8)!)
  exit(1)
}
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let ci = CIImage(contentsOf: inURL) else {
  print("OKUNAMADI"); exit(1)
}

let handler = VNImageRequestHandler(ciImage: ci, options: [:])
let req = VNGenerateForegroundInstanceMaskRequest()

do {
  try handler.perform([req])
  guard let obs = req.results?.first else { print("NESNE_YOK"); exit(2) }
  let buf = try obs.generateMaskedImage(
    ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: true)
  let masked = CIImage(cvPixelBuffer: buf)
  let ctx = CIContext()
  guard let png = ctx.pngRepresentation(
    of: masked, format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB()) else {
    print("KODLANAMADI"); exit(1)
  }
  try png.write(to: outURL)
  // kaynak ve sonuç boyutu — kırpma oranını raporlamak için
  print("OK \(Int(ci.extent.width))x\(Int(ci.extent.height)) -> \(Int(masked.extent.width))x\(Int(masked.extent.height))")
} catch {
  print("HATA \(error)"); exit(1)
}
