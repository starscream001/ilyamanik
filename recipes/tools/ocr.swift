import Foundation
import Vision
import AppKit
for path in CommandLine.arguments.dropFirst() {
 let url = URL(fileURLWithPath:path)
 let request = VNRecognizeTextRequest()
 request.recognitionLevel = .accurate
 request.recognitionLanguages = ["ru-RU", "en-US"]
 request.usesLanguageCorrection = true
 do {
 try VNImageRequestHandler(url:url).perform([request])
 let lines = (request.results ?? []).compactMap { o -> [String:Any]? in
 guard let c = o.topCandidates(1).first else { return nil }
 return ["text":c.string,"confidence":c.confidence,"x":o.boundingBox.minX,"y":o.boundingBox.minY,"w":o.boundingBox.width,"h":o.boundingBox.height]
 }
 let data = try JSONSerialization.data(withJSONObject:lines, options:[.prettyPrinted,.sortedKeys])
 try data.write(to: URL(fileURLWithPath:path.replacingOccurrences(of:".jpg",with:".json")))
 print(path)
 } catch { print("ERROR \(path) \(error)") }
}
