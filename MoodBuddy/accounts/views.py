from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login
import json

from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import check_password
import json

from .models import CustomUser

@method_decorator(csrf_exempt, name='dispatch')
class LoginUserView(View):
    def post(self, request, *args, **kwargs):
        print("hiiii")
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            role =data.get('role')
            try:
                user = CustomUser.objects.get(email=email)
                print(user.email,user.password,password,role,user.role)

                if password == user.password and role == user.role:
                    
                    return JsonResponse({
                        'message': 'Login successful',
                        'user': {'email': user.email, 'role': user.role}
                    }, status=200)
                else:
                    return JsonResponse({'error': 'Incorrect password'}, status=401)
            except CustomUser.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    def get(self, request, *args, **kwargs):
        return JsonResponse({'error': 'Invalid method'}, status=405)


@method_decorator(csrf_exempt, name='dispatch')
class RegisterUserView(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            role = data.get('role', 'user')

            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({'error': 'User already exists'}, status=400)

            user = CustomUser.objects.create(email=email, password=password, role=role)
            user.save()

            return JsonResponse({'message': 'User registered successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
