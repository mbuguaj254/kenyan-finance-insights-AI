
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImpactAnalysis } from "@/types/user";
import { AlertTriangle, CheckCircle, Info, Scale } from "lucide-react";

interface ImpactDisplayProps {
  impacts: ImpactAnalysis[];
}

const ImpactDisplay = ({ impacts }: ImpactDisplayProps) => {
  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'negative': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-green-200 bg-green-50';
      case 'negative': return 'border-red-200 bg-red-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold kenya-text-gradient mb-2">
          Your Personalized Impact Analysis
        </h2>
        <p className="text-gray-600">
          Based on your profile, here's how the Finance Bill 2025 may affect you
        </p>
      </div>

      {impacts.map((impact, index) => (
        <Card key={index} className={`${getImpactColor(impact.impact)} border-l-4`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getImpactIcon(impact.impact)}
                {impact.category}
              </CardTitle>
              <Badge className={getSeverityColor(impact.severity)}>
                {impact.severity} impact
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{impact.description}</p>
            
            {impact.constitutionalRights && impact.constitutionalRights.length > 0 && (
              <Alert>
                <Scale className="h-4 w-4" />
                <AlertDescription>
                  <strong>Constitutional Rights:</strong> {impact.constitutionalRights.join(', ')}
                </AlertDescription>
              </Alert>
            )}
            
            {impact.recommendations && impact.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Recommendations:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {impact.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {impact.loopholes && impact.loopholes.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2 text-kenya-green">
                  Potential Legal Strategies:
                </h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {impact.loopholes.map((loophole, i) => (
                    <li key={i} className="text-kenya-green">{loophole}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImpactDisplay;
