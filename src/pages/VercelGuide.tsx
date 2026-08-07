import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Settings, Plus, Save, RefreshCw, CheckCircle, ExternalLink, TriangleAlert, Terminal, LayoutDashboard, Database, Globe, Search, Bell, Copy, ChevronDown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VercelGuide() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#ededed] font-sans selection:bg-[#f81ce5] selection:text-white pb-24">
      {/* Header */}
      <header className="border-b border-[#333] bg-[#000] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-full font-bold text-xl pb-1">
              ^
            </Link>
            <span className="text-xl font-semibold tracking-tight">AttendX AI Deployment Guide</span>
          </div>
          <Link to="/" className="text-sm text-[#888] hover:text-white flex items-center gap-2 transition-colors">
            Back to App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Fixing Supabase on Vercel</h1>
          <p className="text-[#a1a1aa] text-lg leading-relaxed">
            Your deployed app is currently redirecting to <code className="bg-[#111] border border-[#333] px-2 py-1 rounded text-red-400">dummy.supabase.co</code> because Vercel doesn't have your real environment variables. Follow this visual guide to add them and fix the login.
          </p>
        </div>

        <div className="space-y-24">
          
          {/* STEP 1 & 2 */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg shrink-0">1</div>
              <h2 className="text-2xl font-semibold">Open Project Settings</h2>
            </div>
            <p className="text-[#a1a1aa] mb-6 pl-14">
              Log into your Vercel dashboard, click on the <strong>AttendX AI</strong> project, and navigate to the <strong>Settings</strong> tab.
            </p>
            
            <div className="ml-14 relative bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden shadow-2xl">
              {/* Mock Vercel Nav */}
              <div className="h-14 border-b border-[#333] flex items-center px-4 gap-6 text-sm text-[#888]">
                <span className="text-white">Project</span>
                <span>Deployments</span>
                <span>Metrics</span>
                <span>Logs</span>
                <span className="text-white relative font-medium">
                  Settings
                  <div className="absolute -bottom-[15px] left-0 w-full h-0.5 bg-white"></div>
                </span>
                
                {/* Red Arrow Pointer */}
                <motion.div 
                  initial={{ x: -10, y: 10, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                  className="absolute left-[330px] top-10 flex flex-col items-center"
                >
                  <div className="text-[#ff0080] font-bold text-sm mb-1 bg-[#ff0080]/10 px-2 py-1 rounded border border-[#ff0080]/30 shadow-lg whitespace-nowrap">Click Settings</div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-[135deg]">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </motion.div>
              </div>
              <div className="p-8 h-48 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
                <div className="w-48 h-8 bg-[#222] rounded mb-4"></div>
                <div className="w-full h-24 bg-[#111] border border-[#222] rounded-lg"></div>
              </div>
            </div>
          </section>

          {/* STEP 3 */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg shrink-0">2</div>
              <h2 className="text-2xl font-semibold">Navigate to Environment Variables</h2>
            </div>
            <p className="text-[#a1a1aa] mb-6 pl-14">
              In the left sidebar of the Settings page, click on <strong>Environment Variables</strong>.
            </p>
            
            <div className="ml-14 relative bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden flex shadow-2xl h-64">
              <div className="w-64 border-r border-[#333] p-4 space-y-1">
                <div className="px-3 py-2 text-sm text-[#888] rounded-md">General</div>
                <div className="px-3 py-2 text-sm text-[#888] rounded-md">Domains</div>
                <div className="px-3 py-2 text-sm text-[#888] rounded-md">Integrations</div>
                <div className="px-3 py-2 text-sm text-[#888] rounded-md">Git</div>
                <div className="px-3 py-2 text-sm text-white bg-[#222] rounded-md relative font-medium">
                  Environment Variables
                  
                  {/* Red Arrow Pointer */}
                  <motion.div 
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                    className="absolute -right-[180px] top-0 flex items-center gap-2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    <div className="text-[#ff0080] font-bold text-sm bg-[#ff0080]/10 px-2 py-1 rounded border border-[#ff0080]/30 shadow-lg whitespace-nowrap">Click Here</div>
                  </motion.div>
                </div>
                <div className="px-3 py-2 text-sm text-[#888] rounded-md">Security</div>
              </div>
              <div className="flex-1 p-8">
                <div className="w-64 h-8 bg-[#222] rounded mb-6"></div>
                <div className="w-full h-10 bg-[#111] border border-[#333] rounded-md mb-4"></div>
                <div className="w-full h-10 bg-[#111] border border-[#333] rounded-md"></div>
              </div>
            </div>
          </section>

          {/* STEP 4 */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg shrink-0">3</div>
              <h2 className="text-2xl font-semibold">Add Your Variables</h2>
            </div>
            <p className="text-[#a1a1aa] mb-6 pl-14">
              Copy and paste the following keys and values exactly as shown. Ensure all environments (Production, Preview, Development) are checked.
            </p>

            <div className="ml-14 mb-8 space-y-4">
              <div className="bg-[#111] border border-[#333] p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#888] mb-1">Key 1</div>
                  <code className="text-[#0070f3] font-mono">VITE_SUPABASE_URL</code>
                </div>
                <div className="flex-1 ml-8">
                  <div className="text-xs text-[#888] mb-1">Value 1</div>
                  <code className="text-[#ededed] font-mono break-all">https://dsghskncangbbkaxgczd.supabase.co</code>
                </div>
                <button onClick={() => copyToClipboard('VITE_SUPABASE_URL=https://dsghskncangbbkaxgczd.supabase.co', 'url')} className="ml-4 p-2 bg-[#222] rounded hover:bg-[#333] transition-colors">
                  {copied === 'url' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-[#111] border border-[#333] p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#888] mb-1">Key 2</div>
                  <code className="text-[#0070f3] font-mono">VITE_SUPABASE_ANON_KEY</code>
                </div>
                <div className="flex-1 ml-8">
                  <div className="text-xs text-[#888] mb-1">Value 2</div>
                  <code className="text-[#a1a1aa] font-mono">&lt;Paste your Supabase Anon Key here&gt;</code>
                </div>
                <button onClick={() => copyToClipboard('VITE_SUPABASE_ANON_KEY=', 'anon')} className="ml-4 p-2 bg-[#222] rounded hover:bg-[#333] transition-colors">
                  {copied === 'anon' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-[#111] border border-[#333] p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#888] mb-1">Key 3</div>
                  <code className="text-[#0070f3] font-mono">VITE_API_BASE_URL</code>
                </div>
                <div className="flex-1 ml-8">
                  <div className="text-xs text-[#888] mb-1">Value 3</div>
                  <code className="text-[#ededed] font-mono break-all">https://attend-x-ai.vercel.app/api</code>
                </div>
                <button onClick={() => copyToClipboard('VITE_API_BASE_URL=https://attend-x-ai.vercel.app/api', 'api')} className="ml-4 p-2 bg-[#222] rounded hover:bg-[#333] transition-colors">
                  {copied === 'api' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-[#111] border border-[#333] p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#888] mb-1">Key 4</div>
                  <code className="text-[#0070f3] font-mono">VITE_GEMINI_API_KEY</code>
                </div>
                <div className="flex-1 ml-8">
                  <div className="text-xs text-[#888] mb-1">Value 4</div>
                  <code className="text-[#a1a1aa] font-mono">&lt;Paste your Gemini API Key here&gt;</code>
                </div>
                <button onClick={() => copyToClipboard('VITE_GEMINI_API_KEY=', 'gemini')} className="ml-4 p-2 bg-[#222] rounded hover:bg-[#333] transition-colors">
                  {copied === 'gemini' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Vercel Add Form Mockup */}
            <div className="ml-14 relative bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden shadow-2xl p-6">
              <h3 className="font-medium text-lg mb-4">Add New</h3>
              
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="text-sm text-[#888] mb-2">Key</div>
                  <div className="w-full h-10 bg-[#000] border border-[#333] rounded-md px-3 flex items-center font-mono text-sm">VITE_SUPABASE_URL</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#888] mb-2">Value</div>
                  <div className="w-full h-10 bg-[#000] border border-[#333] rounded-md px-3 flex items-center font-mono text-sm text-[#888]">https://dsghskncangbbkaxgczd.supabase.co</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-[#888] mb-3">Environments</div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center"><Check className="w-3 h-3 text-black" /></div>
                    <span className="text-sm">Production</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center"><Check className="w-3 h-3 text-black" /></div>
                    <span className="text-sm">Preview</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center"><Check className="w-3 h-3 text-black" /></div>
                    <span className="text-sm">Development</span>
                  </label>
                </div>
                
                {/* Pointer for environments */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                  className="absolute left-[80px] top-[190px] flex flex-col items-center"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-rotate-90">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <div className="text-[#ff0080] font-bold text-xs bg-[#ff0080]/10 px-2 py-1 rounded border border-[#ff0080]/30 shadow-lg mt-1">Keep all 3 checked</div>
                </motion.div>
              </div>

              <div className="flex justify-end">
                <div className="relative">
                  <button className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
                    Save
                  </button>
                  
                  {/* Pointer for Save */}
                  <motion.div 
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                    className="absolute -right-[150px] top-0 flex items-center gap-2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    <div className="text-[#ff0080] font-bold text-sm bg-[#ff0080]/10 px-2 py-1 rounded border border-[#ff0080]/30 shadow-lg whitespace-nowrap">Click Save</div>
                  </motion.div>
                </div>
              </div>
            </div>
            
            <div className="ml-14 mt-4 bg-[#ff0080]/10 border border-[#ff0080]/30 p-4 rounded-lg flex items-start gap-3">
              <TriangleAlert className="w-5 h-5 text-[#ff0080] shrink-0 mt-0.5" />
              <p className="text-sm text-[#ff0080]">
                <strong>Important:</strong> Repeat this process for <strong>all 4 variables</strong> before moving to the next step.
              </p>
            </div>
          </section>

          {/* STEP 5 */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg shrink-0">4</div>
              <h2 className="text-2xl font-semibold">Redeploy Your App</h2>
            </div>
            <p className="text-[#a1a1aa] mb-6 pl-14">
              Environment variables are injected during the build process. You <strong>MUST</strong> redeploy your app for the new variables to take effect.
            </p>
            
            <div className="ml-14 relative bg-[#0a0a0a] border border-[#333] rounded-xl overflow-hidden flex flex-col shadow-2xl h-80">
              <div className="h-14 border-b border-[#333] flex items-center px-4 gap-6 text-sm text-[#888]">
                <span className="text-white relative font-medium">
                  Deployments
                  <div className="absolute -bottom-[15px] left-0 w-full h-0.5 bg-white"></div>
                </span>
                <span>Metrics</span>
                <span>Logs</span>
                <span>Settings</span>
              </div>
              
              <div className="p-6 flex-1">
                <div className="bg-[#111] border border-[#333] rounded-lg p-5 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#0070f3] rounded-full"></div>
                    <div>
                      <div className="font-medium text-white mb-1 flex items-center gap-2">
                        Production (Current)
                        <span className="text-[10px] bg-[#333] px-1.5 py-0.5 rounded text-white">main</span>
                      </div>
                      <div className="text-sm text-[#888]">Deployed 2 hours ago by You</div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="w-8 h-8 rounded border border-[#333] flex items-center justify-center text-white hover:bg-[#222] cursor-pointer">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-[#888] rounded-full"></div>
                        <div className="w-1 h-1 bg-[#888] rounded-full"></div>
                        <div className="w-1 h-1 bg-[#888] rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Mock Dropdown */}
                    <div className="absolute right-0 top-10 w-48 bg-[#111] border border-[#333] rounded-lg shadow-xl overflow-hidden z-10">
                      <div className="px-4 py-2.5 text-sm text-[#888] hover:bg-[#222] hover:text-white border-b border-[#222]">Inspect Deployment</div>
                      <div className="px-4 py-2.5 text-sm text-[#888] hover:bg-[#222] hover:text-white border-b border-[#222]">Promote to Production</div>
                      <div className="px-4 py-2.5 text-sm text-white bg-[#0070f3]/10 hover:bg-[#0070f3]/20 relative">
                        Redeploy
                        
                        {/* Pointer for Redeploy */}
                        <motion.div 
                          initial={{ x: 10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                          className="absolute -right-[230px] top-1/2 -translate-y-1/2 flex items-center gap-2"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff0080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                          <div className="text-[#ff0080] font-bold text-sm bg-[#ff0080]/10 px-2 py-1 rounded border border-[#ff0080]/30 shadow-lg whitespace-nowrap">
                            1. Click Dots<br/>2. Click Redeploy
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-14 mt-6">
              <ol className="list-decimal list-inside text-[#a1a1aa] space-y-2">
                <li>Go to the <strong>Deployments</strong> tab at the top of your project page.</li>
                <li>Find your most recent deployment at the top of the list.</li>
                <li>Click the three dots (<strong className="tracking-widest">...</strong>) on the right side.</li>
                <li>Select <strong>Redeploy</strong> from the dropdown menu.</li>
                <li>Wait 1-2 minutes for the new build to complete.</li>
              </ol>
            </div>
          </section>

          {/* STEP 6 */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg shrink-0">5</div>
              <h2 className="text-2xl font-semibold">Test Google Login</h2>
            </div>
            <p className="text-[#a1a1aa] mb-6 pl-14">
              Once the deployment turns green (<span className="inline-flex items-center text-emerald-400 gap-1"><CheckCircle className="w-4 h-4" /> Ready</span>), visit your live site and test the login.
            </p>

            <div className="ml-14 bg-[#111] border border-[#333] rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Variables Successfully Injected</h3>
              <p className="text-[#888] max-w-md mb-8">
                The application will now securely connect to your actual Supabase instance instead of the dummy fallback.
              </p>
              
              <div className="flex gap-4">
                <a href="https://attend-x-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                  Open Live App <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="ml-14 mt-8 bg-[#0070f3]/10 border border-[#0070f3]/30 p-6 rounded-lg">
              <h4 className="text-[#0070f3] font-semibold flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5" /> Google OAuth Verification
              </h4>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">
                When you click "Continue with Google", verify that the URL briefly changes to <code className="text-white bg-[#222] px-1 rounded">https://dsghskncangbbkaxgczd.supabase.co/auth/v1/authorize...</code> instead of the dummy URL. If you still see the dummy URL, ensure you redeployed the app in Step 4.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
