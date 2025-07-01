import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Plus, X, Save, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomQA {
  id?: string;
  question: string;
  answer: string;
}

interface ChatCustomizationProps {
  clinicId: string;
}

const ChatCustomization = ({ clinicId }: ChatCustomizationProps) => {
  const [customizations, setCustomizations] = useState({
    custom_header_title: '',
    custom_header_subtitle: '',
    custom_intro_message: '',
    custom_intro_subtitle: '',
    custom_common_questions: [] as string[]
  });
  
  const [customQAs, setCustomQAs] = useState<CustomQA[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCommonQuestion, setNewCommonQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomizations();
    fetchCustomQAs();
  }, [clinicId]);

  const fetchCustomizations = async () => {
    try {
      const { data, error } = await supabase
        .from('clinics')
        .select('custom_header_title, custom_header_subtitle, custom_intro_message, custom_intro_subtitle, custom_common_questions')
        .eq('clinic_id', clinicId)
        .single();

      if (error) throw error;

      if (data) {
        setCustomizations({
          custom_header_title: data.custom_header_title || '',
          custom_header_subtitle: data.custom_header_subtitle || '',
          custom_intro_message: data.custom_intro_message || '',
          custom_intro_subtitle: data.custom_intro_subtitle || '',
          custom_common_questions: data.custom_common_questions || []
        });
      }
    } catch (error) {
      console.error('Error fetching customizations:', error);
      toast({
        title: "Error",
        description: "Failed to load customizations",
        variant: "destructive"
      });
    }
  };

  const fetchCustomQAs = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_qa_pairs')
        .select('*')
        .eq('clinic_id', clinicId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomQAs(data || []);
    } catch (error) {
      console.error('Error fetching custom Q&As:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCustomizations = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('clinics')
        .update(customizations)
        .eq('clinic_id', clinicId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customizations saved successfully!",
      });
    } catch (error) {
      console.error('Error saving customizations:', error);
      toast({
        title: "Error",
        description: "Failed to save customizations",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addCustomQA = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast({
        title: "Error",
        description: "Both question and answer are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('custom_qa_pairs')
        .insert({
          clinic_id: clinicId,
          question: newQuestion.trim(),
          answer: newAnswer.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setCustomQAs([data, ...customQAs]);
      setNewQuestion('');
      setNewAnswer('');
      
      toast({
        title: "Success",
        description: "Custom Q&A added successfully!",
      });
    } catch (error) {
      console.error('Error adding custom Q&A:', error);
      toast({
        title: "Error",
        description: "Failed to add custom Q&A",
        variant: "destructive"
      });
    }
  };

  const removeCustomQA = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_qa_pairs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCustomQAs(customQAs.filter(qa => qa.id !== id));
      
      toast({
        title: "Success",
        description: "Custom Q&A removed successfully!",
      });
    } catch (error) {
      console.error('Error removing custom Q&A:', error);
      toast({
        title: "Error",
        description: "Failed to remove custom Q&A",
        variant: "destructive"
      });
    }
  };

  const addCommonQuestion = () => {
    if (!newCommonQuestion.trim()) return;
    
    setCustomizations(prev => ({
      ...prev,
      custom_common_questions: [...prev.custom_common_questions, newCommonQuestion.trim()]
    }));
    setNewCommonQuestion('');
  };

  const removeCommonQuestion = (index: number) => {
    setCustomizations(prev => ({
      ...prev,
      custom_common_questions: prev.custom_common_questions.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading customizations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Chat Customization</h2>
      </div>

      {/* Header Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Header Messages</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Header Title</label>
            <Input
              value={customizations.custom_header_title}
              onChange={(e) => setCustomizations(prev => ({ ...prev, custom_header_title: e.target.value }))}
              placeholder="Try Me: The 24/7 Assistant for Your Practice"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Header Subtitle</label>
            <Textarea
              value={customizations.custom_header_subtitle}
              onChange={(e) => setCustomizations(prev => ({ ...prev, custom_header_subtitle: e.target.value }))}
              placeholder="Ask me anything about your dental practice—services, insurance, hours, or location. I'm available 24/7."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Intro Message Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Intro Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Intro Message</label>
            <Input
              value={customizations.custom_intro_message}
              onChange={(e) => setCustomizations(prev => ({ ...prev, custom_intro_message: e.target.value }))}
              placeholder="Hi there! I'm a demo AI assistant for dental practices."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Intro Subtitle</label>
            <Textarea
              value={customizations.custom_intro_subtitle}
              onChange={(e) => setCustomizations(prev => ({ ...prev, custom_intro_subtitle: e.target.value }))}
              placeholder="Ask me anything about your dental practice—services, insurance, hours, or location. I'm available 24/7."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Common Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Common Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newCommonQuestion}
              onChange={(e) => setNewCommonQuestion(e.target.value)}
              placeholder="Add a common question..."
              onKeyPress={(e) => e.key === 'Enter' && addCommonQuestion()}
            />
            <Button onClick={addCommonQuestion} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {customizations.custom_common_questions.map((question, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">{question}</span>
                <Button
                  onClick={() => removeCommonQuestion(index)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Q&A Pairs */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Questions & Answers</CardTitle>
          <p className="text-sm text-gray-600">
            Add specific questions and answers that your AI assistant should know about your practice.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Q&A */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Add New Q&A</h4>
            <div>
              <label className="block text-sm font-medium mb-2">Question</label>
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="What question might clients ask?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Answer</label>
              <Textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="How should the AI respond?"
                rows={3}
              />
            </div>
            <Button onClick={addCustomQA} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Q&A Pair
            </Button>
          </div>

          {/* Existing Q&As */}
          {customQAs.length > 0 && (
            <div>
              <h4 className="font-medium mb-4">Your Custom Q&As ({customQAs.length})</h4>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {customQAs.map((qa) => (
                    <div key={qa.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline">Q</Badge>
                        <Button
                          onClick={() => removeCustomQA(qa.id!)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-medium text-sm">{qa.question}</p>
                      <Badge variant="secondary">A</Badge>
                      <p className="text-sm text-gray-600">{qa.answer}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={saveCustomizations} 
          disabled={isSaving}
          size="lg"
        >
          {isSaving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatCustomization;
