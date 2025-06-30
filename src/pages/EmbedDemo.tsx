
const EmbedDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Embed Widget Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            How to Embed the Dental Chat Widget
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Step 1: Get Your Clinic ID</h3>
              <p className="text-gray-600">
                Contact us to get your unique clinic ID. This ensures the chat widget 
                uses your practice's specific information.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Step 2: Add the Script</h3>
              <p className="text-gray-600 mb-2">
                Add this script tag to your website, preferably before the closing &lt;/body&gt; tag:
              </p>
              <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code className="text-sm">
                  {`<script defer src="${window.location.origin}/widget.js" data-clinic-id="your-clinic-id"></script>`}
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Step 3: Test It</h3>
              <p className="text-gray-600">
                The chat widget will appear as a blue circle in the bottom-right corner 
                of your website. Visitors can click it to start chatting!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Widget Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">🤖 AI-Powered Responses</h3>
              <p className="text-gray-600 text-sm">
                Uses ChatGPT to provide intelligent, contextual responses based on your practice information.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">🏥 Practice-Specific Info</h3>
              <p className="text-gray-600 text-sm">
                Automatically includes your hours, services, insurance, and contact information in responses.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">📱 Mobile Responsive</h3>
              <p className="text-gray-600 text-sm">
                Works perfectly on desktop, tablet, and mobile devices.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">🎨 Customizable</h3>
              <p className="text-gray-600 text-sm">
                Colors and branding can be customized to match your website design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedDemo;
