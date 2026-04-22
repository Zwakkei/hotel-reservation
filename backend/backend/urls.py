from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes

# API Documentation View
class APIDocumentationView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({
            'api_name': 'Hotel Reservation System',
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'api_root': '/api/',
                'admin_panel': '/admin/',
                'api_endpoints': {
                    'auth': {
                        'register': '/api/register/',
                        'login': '/api/login/',
                        'refresh': '/api/token/refresh/',
                        'me': '/api/me/',
                    },
                    'rooms': {
                        'list': '/api/rooms/',
                        'detail': '/api/rooms/<id>/',
                        'available': '/api/rooms/available/',
                    },
                    'reservations': {
                        'list': '/api/reservations/',
                        'detail': '/api/reservations/<id>/',
                        'cancel': '/api/reservations/<id>/cancel/',
                        'my': '/api/my-reservations/',
                    }
                }
            }
        })

# Health check view
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        'status': 'healthy',
        'server': 'running',
        'timestamp': '2024-01-01'
    })

urlpatterns = [
    # API Documentation at root
    path('', APIDocumentationView.as_view(), name='api-docs'),
    
    # Admin panel
    path('admin/', admin.site.urls),
    
    # API endpoints - THIS IS THE IMPORTANT ONE
    path('api/', include('api.urls')),
    
    # Health check
    path('health/', health_check, name='health-check'),
]

