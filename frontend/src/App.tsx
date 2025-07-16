// File: src/App.tsx (Frontend)
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Copy, Code, ChevronRight, Globe, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function App() {
  const [htmlInput, setHtmlInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [locators, setLocators] = useState<Array<{
    element: string
    locators: Record<string, string>
  }> | null>(null)
  const [capturedAllLocators, setCapturedAllLocators] = useState<Record<string, Array<{
    element: string
    locator: string
  }>> | null>(null)

  const fetchPageHTML = async () => {
    if (!urlInput.trim()) return
    setIsFetching(true)
  
    try {
      const response = await fetch('https://advanced-web-element-locator-checker.onrender.com/fetch-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput }),
      })
  
      const data = await response.json()
      setHtmlInput(data.html || '')
    } catch (error) {
      alert("❌ Failed to fetch HTML. Please check the URL or CORS settings.")
      console.error(error)
    } finally {
      setIsFetching(false)
    }
  }
  

  const generateLocators = () => {
    if (!htmlInput.trim()) return
    setIsProcessing(true)
    setTimeout(() => {
      const mockLocators = [
        {
          element: 'button#submit.btn.primary',
          locators: {
            javascript: `const submitBtn = document.querySelector('button#submit');`,
            python: `submit_btn = driver.find_element(By.CSS_SELECTOR, 'button#submit')`,
            java: `WebElement submitBtn = driver.findElement(By.cssSelector("button#submit"));`,
            xpath: `//button[@id='submit' and contains(@class, 'btn') and contains(@class, 'primary')]`
          }
        },
        {
          element: 'input.email[type="email"]',
          locators: {
            javascript: `const emailInput = document.querySelector('input.email');`,
            python: `email_input = driver.find_element(By.CSS_SELECTOR, 'input.email')`,
            java: `WebElement emailInput = driver.findElement(By.cssSelector("input.email"));`,
            xpath: `//input[contains(@class, 'email') and @type="email"]`
          }
        },
        {
          element: 'a.link[href="/about"]',
          locators: {
            javascript: `const aboutLink = document.querySelector('a.link[href="/about"]');`,
            python: `about_link = driver.find_element(By.CSS_SELECTOR, 'a.link[href="/about"]')`,
            java: `WebElement aboutLink = driver.findElement(By.cssSelector("a.link[href=\"/about\"]"));`,
            xpath: `//a[contains(@class, 'link') and @href="/about"]`
          }
        }
      ]
      setLocators(mockLocators)
      const allLocators: Record<string, Array<{ element: string, locator: string }>> = {
        javascript: [],
        python: [],
        java: [],
        xpath: []
      }
      mockLocators.forEach(item => {
        Object.keys(item.locators).forEach(lang => {
          allLocators[lang].push({
            element: item.element,
            locator: item.locators[lang]
          })
        })
      })
      setCapturedAllLocators(allLocators)
      setIsProcessing(false)
    }, 1000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadAllLocators = () => {
    if (!capturedAllLocators) return
    const data = JSON.stringify(capturedAllLocators, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all_locators.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Advanced Web Element Locator Checker</CardTitle>
            <CardDescription>
              Analyze URLs or paste HTML to get comprehensive locators in multiple languages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url-input">Website URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url-input"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1"
                  />
                  <Button 
                    onClick={fetchPageHTML}
                    disabled={isFetching || !urlInput.trim()}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {isFetching ? 'Fetching...' : 'Fetch HTML'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="html-input">HTML Code</Label>
                <Textarea
                  id="html-input"
                  value={htmlInput}
                  onChange={(e) => setHtmlInput(e.target.value)}
                  placeholder="Paste your HTML here or fetch from URL above..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="w-48">
                <Label>Output Language</Label>
                <Select 
                  value={selectedLanguage} 
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="xpath">XPath</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                {capturedAllLocators && (
                  <Button 
                    variant="outline"
                    onClick={downloadAllLocators}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                )}
                <Button 
                  onClick={generateLocators}
                  disabled={isProcessing || !htmlInput.trim()}
                >
                  {isProcessing ? 'Processing...' : 'Generate Locators'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {isProcessing && (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-gray-500">
                  Analyzing DOM structure and generating locators...
                </div>
              </div>
            )}

            {locators && !isProcessing && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Generated Locators</h3>
                  <div className="text-sm text-gray-500">
                    {locators.length} elements found
                  </div>
                </div>

                {selectedLanguage === 'all' ? (
                  <Tabs defaultValue="javascript" className="w-full">
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="java">Java</TabsTrigger>
                      <TabsTrigger value="xpath">XPath</TabsTrigger>
                    </TabsList>
                    {Object.keys(capturedAllLocators || {}).map((lang) => (
                      <TabsContent key={lang} value={lang}>
                        <div className="space-y-4 mt-4">
                          {capturedAllLocators?.[lang].map((item, idx) => (
                            <div key={idx} className="border rounded-lg p-4 bg-white">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Code className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-mono text-gray-700">{item.element}</span>
                                  </div>
                                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                                    {item.locator}
                                  </pre>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(item.locator)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div className="space-y-4">
                    {locators.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Code className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-mono text-gray-700">{item.element}</span>
                            </div>
                            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                              {item.locators[selectedLanguage]}
                            </pre>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(item.locators[selectedLanguage])}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
